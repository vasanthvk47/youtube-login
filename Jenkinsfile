pipeline {
    agent any

    environment {
        IMAGE_NAME = "vasanth4747/student-college-login-animation"
        TAG = "latest"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/vasanthvk47/student-college-animation.git'
            }
        }

        stage('Verify Minikube Environment Before Build') {
            steps {
                script {
                    // Check if kubectl is correctly configured and verify Minikube context
                    sh "kubectl version --client"
                    sh "kubectl config current-context"
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // Build the Docker image
                    sh "docker build -t $IMAGE_NAME:$TAG ."
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-password', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                    script {
                        // Log in to Docker Hub and push the image
                        sh '''
                            echo "$PASSWORD" | docker login -u "$USERNAME" --password-stdin
                            docker push "$IMAGE_NAME:$TAG"
                        '''
                    }
                }
            }
        }

        stage('Verify Minikube Environment After Build') {
            steps {
                script {
                    // Verify kubectl setup after the build
                    sh "kubectl version --client"
                    sh "kubectl config current-context"
                }
            }
        }

        stage('Set Minikube Context') {
            steps {
                script {
                    // Ensure the Minikube context is used for deployment
                    sh "kubectl config use-context minikube"
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    // Apply deployment and service configurations to Minikube
                    sh "kubectl apply -f k8s/deployment.yaml --validate=false --insecure-skip-tls-verify=true"
                    sh "kubectl apply -f k8s/service.yaml --validate=false --insecure-skip-tls-verify=true"
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                script {
                    // Verify if the pod is running and the deployment was successful
                    sh "kubectl get pods"
                    sh "kubectl get deployments"
                    sh "kubectl get services"

                    // Check if the pod is running
                    sh "kubectl rollout status deployment/student-college-login-animation"
                }
            }
        }
    }

    post {
        success {
            echo 'Deployment was successful!'
        }

        failure {
            echo 'Deployment failed. Check the logs for errors.'
        }
    }
}
